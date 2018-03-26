import customVendor from './moment';
import {Moment} from 'moment'

declare var Context: {
    moment: Moment
};


Context.moment = customVendor.moment;