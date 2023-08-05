import { extractReferrerFromURL, randomString } from "./str.utils"

describe('randomString', function() {
    it('should random string based on length', function() {
        expect(randomString(4).length).toEqual(4);
    });
});

describe('extractReferrerFromURL', function() {
    it('should return the referrer from https URL', function() {
        expect(extractReferrerFromURL('https://localhost:3000/s/abcdf')).toEqual('abcdf');
    });
    it('should return the referrer from http URL', function() {
        expect(extractReferrerFromURL('http://localhost:3000/s/abcdf')).toEqual('abcdf');
    });
});