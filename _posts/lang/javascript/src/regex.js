const target = "Is this is";
const regex = /is/g;

const ret = target.match(regex);
const ret1 = regex.exec(target);

ret;
ret1;