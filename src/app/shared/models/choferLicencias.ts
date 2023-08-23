import { Chofer } from './chofer';
import { Licencias } from './licencias';

export interface LicenciaChofer {
  id: string;
  chofer: Chofer | null;
  licencia: Licencias;
}
