import { LicenciaChofer } from './choferLicencias';

export interface Licencias {
  id: string;
  nombre: string;
  estado: boolean;
  choferes: LicenciaChofer;
}
