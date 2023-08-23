import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Chofer } from '../entity/Chofer';
import { LicenciaChofer } from '../entity/ChoferLicencias';

class ChoferController {
  static getAll = async (req: Request, resp: Response) => {
    try {
      const choferRepo = AppDataSource.getRepository(Chofer);
      const lista = await choferRepo.find({
        where: { estado: true },
        relations: { licencias: true },
      });
      if (lista.length == 0) {
        return resp.status(404).json({ mensaje: 'No se encontró resultados.' });
      }
      return resp.status(200).json(lista);
    } catch (error) {
      return resp.status(400).json({ mensaje: error });
    }
  };

  static getById = async (req: Request, resp: Response) => {
    try {
      const cedula = req.params['cedula'];
      if (!cedula) {
        return resp
          .status(404)
          .json({ mensaje: 'No se indica la cedula del chofer' });
      }
      const choferRepo = AppDataSource.getRepository(Chofer);
      let chofer;
      try {
        chofer = await choferRepo.findOneOrFail({
          where: { cedula: cedula },
          relations: { licencias: true },
        });
      } catch (error) {
        return resp
          .status(404)
          .json({ mensaje: 'No se encontro el chofer con esa cedula' });
      }
      return resp.status(200).json(chofer);
    } catch (error) {
      return resp.status(400).json({ mensaje: error });
    }
  };

  static add = async (req: Request, resp: Response) => {
    try {
      const { cedula, nombre, apellido1, apellido2, fechaNac, licencias } =
        req.body;
      if (
        !cedula ||
        !nombre ||
        !apellido1 ||
        !apellido2 ||
        !fechaNac ||
        !licencias
      ) {
        return resp.status(400).json({ mensaje: 'Faltan datos requeridos.' });
      }

      const choferRepo = AppDataSource.getRepository(Chofer);
      const chofer = await choferRepo.findOne({ where: { cedula: cedula } });
      if (chofer) {
        return resp
          .status(400)
          .json({ mensaje: 'El chofer ya existe en la base de datos' });
      }

      const hoy = new Date();
      const cumpleanos = new Date(fechaNac);
      let edad = hoy.getFullYear() - cumpleanos.getFullYear();
      const monthDiff = hoy.getMonth() - cumpleanos.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && hoy.getDate() < cumpleanos.getDate())
      ) {
        edad--;
      }
      if (edad < 18) {
        return resp
          .status(400)
          .json({ mensaje: 'El chofer debe ser mayor de 18 años.' });
      }

      const uniqueLicencias = new Set();
      for (const lic of licencias) {
        if (uniqueLicencias.has(lic.id)) {
          return resp
            .status(400)
            .json({ mensaje: 'No se permiten licencias repetidas.' });
        }
        uniqueLicencias.add(lic.id);
      }

      const listaLicencias = licencias.map((lic) => {
        const licChof = new LicenciaChofer();
        licChof.chofer = cedula;
        licChof.licencia = lic.id;
        return licChof;
      });

      let choferNew = new Chofer();
      choferNew.cedula = cedula;
      choferNew.nombre = nombre;
      choferNew.apellido1 = apellido1;
      choferNew.apellido2 = apellido2;
      choferNew.fechaNac = fechaNac;
      choferNew.licencias = listaLicencias;
      choferNew.estado = true;
      try {
        await choferRepo.save(choferNew);
        return resp.status(201).json({ mensaje: 'Chofer creado' });
      } catch (error) {
        return resp.status(400).json({ mensaje: 'Error al guardar.' });
      }
    } catch (error) {
      return resp.status(400).json({ mensaje: error });
    }
  };

  static update = async (req: Request, resp: Response) => {
    //   const { id, nombre, precio, stock, fechaIngreso } = req.body;
    //   //validacion de datos de entrada
    //   if (!id) {
    //     return resp.status(404).json({ mensaje: "Debe indicar el ID" });
    //   }
    //   if (!nombre) {
    //     return resp
    //       .status(404)
    //       .json({ mensaje: "Debe indicar el nombre del producto" });
    //   }
    //   if (!precio) {
    //     return resp.status(404).json({ mensaje: "Debe indicar el precio" });
    //   }
    //   if (precio < 0) {
    //     return resp
    //       .status(404)
    //       .json({ mensaje: "Debe indicar un precio mayor que 0" });
    //   }
    //   if (!stock) {
    //     return resp
    //       .status(404)
    //       .json({ mensaje: "Debe indicar el stock del producto" });
    //   }
    //   if (stock < 0) {
    //     return resp
    //       .status(404)
    //       .json({ mensaje: "El stock debe ser mayor que ser" });
    //   }
    //   //Validar Reglas de negocio
    //   const productosRepo = AppDataSource.getRepository(Producto);
    //   let pro: Producto;
    //   try {
    //     pro = await productosRepo.findOneOrFail({ where: { id } });
    //   } catch (error) {
    //     return resp.status(404).json({ mensaje: "No existe el producto." });
    //   }
    //   pro.nombre = nombre;
    //   pro.precio = precio;
    //   pro.stock = stock;
    //   // pro.fechaIngreso
    //   //Validar con class validator
    //   const errors = await validate(pro, {
    //     validationError: { target: false, value: false },
    //   });
    //   if (errors.length > 0) {
    //     return resp.status(400).json(errors);
    //   }
    //   try {
    //     await productosRepo.save(pro);
    //     return resp.status(200).json({ mensaje: "Se guardo correctamente" });
    //   } catch (error) {
    //     return resp.status(400).json({ mensaje: "No pudo guardar." });
    //   }
  };
  static delete = async (req: Request, resp: Response) => {
    //   try {
    //     const id = parseInt(req.params["id"]);
    //     if (!id) {
    //       return resp.status(404).json({ mensaje: "Debe indicar el ID" });
    //     }
    //     const productosRepo = AppDataSource.getRepository(Producto);
    //     let pro: Producto;
    //     try {
    //       pro = await productosRepo.findOneOrFail({
    //         where: { id: id, estado: true },
    //       });
    //     } catch (error) {
    //       return resp
    //         .status(404)
    //         .json({ mensaje: "No se encuentra el producto con ese ID" });
    //     }
    //     pro.estado = false;
    //     try {
    //       await productosRepo.save(pro);
    //       return resp.status(200).json({ mensaje: "Se eliminó correctamente" });
    //     } catch (error) {
    //       return resp.status(400).json({ mensaje: "No se pudo eliminar." });
    //     }
    //   } catch (error) {
    //     return resp.status(400).json({ mensaje: "No se pudo eliminar" });
    //   }
  };
}

export default ChoferController;
