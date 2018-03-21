import moment, { Moment } from 'moment';

export default (function() : {
    moment: Moment
} {
    const _moment = moment();

    _moment.locale('fr');

    return {
        moment: _moment
    }

})();