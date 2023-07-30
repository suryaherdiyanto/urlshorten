import { randomString } from "./str.utils"

describe('randomString', function() {
    it('should random string based on length', function() {
        expect(randomString(4).length).toEqual(4);
    });
});