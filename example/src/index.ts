import { mapConfig } from './config/map.config';
import { providerConfig } from './config/provider.config';
import { ResultsMapModule } from './modules';

new ResultsMapModule('#map-container', mapConfig, ...providerConfig);
