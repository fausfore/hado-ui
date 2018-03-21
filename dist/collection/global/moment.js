import moment from 'moment';
export default (function () {
    const _moment = moment();
    _moment.locale('fr');
    return {
        moment: _moment
    };
})();
