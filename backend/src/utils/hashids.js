import Hashids from 'hashids/cjs';

const HASHIDS_SECRET_KEY = process.env.HASHIDS_SECRET_KEY;
const HASHIDS_PADDING = process.env.HASHIDS_PADDING;

const hashids = new Hashids(HASHIDS_SECRET_KEY, +HASHIDS_PADDING);

const encode = (...data) => hashids.encode(...data);

const decode = hash => hashids.decode(hash);

export default { encode, decode };
