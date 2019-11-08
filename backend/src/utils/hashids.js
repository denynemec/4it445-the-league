import Hashids from 'hashids/cjs';

const HASHIDS_SECRET_KEY = 'HASHIDS_SECRET_KEY';
const HASHIDS_PADDING = 15;

const hashids = new Hashids(HASHIDS_SECRET_KEY, HASHIDS_PADDING);

export const encode = hashids.encode;

const decode = hash => hashids.decode(hash);

export default { encode, decode };
