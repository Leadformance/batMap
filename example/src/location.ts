import { mapConfig } from './config/map.config';
import { providerConfig } from './config/provider.config';
import { LocationMapModule } from './modules';

new LocationMapModule('#map-container', mapConfig, ...providerConfig);
