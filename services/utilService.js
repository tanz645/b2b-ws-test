class UtilService {

    static parseValidJson(data) {
        if (!data){
            return false;
        }
        try {
            const json = JSON.parse(data)
            if (json && typeof json === "object") {
                return json;
            }
        } catch (e) {
            return false;
        }
    }
}

module.exports = UtilService;