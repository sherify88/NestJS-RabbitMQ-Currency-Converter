export default class RequestHeaderInfo {
    static acceptedLang: string='en';
    static isAr() {
        return RequestHeaderInfo.acceptedLang === 'ar'
    };
    static isEn() {
        return RequestHeaderInfo.acceptedLang === 'en'
    };

}
