import crypto from 'crypto';

var pubre = /^(ssh-[dr]s[as]\s+)|(\s+.+)|\n/g;

export function fingerprint(pub, alg) {
    alg = alg || 'rsa'; // OpenSSH Standard

    var cleanpub = pub.replace(pubre, '');
    var pubbuffer = new Buffer(cleanpub, 'base64');
    var key = hash(pubbuffer, alg);

    return colons(key);
}

function hash(s, alg) {
    return crypto.createHash(alg).update(s).digest('hex');
}

// add colons, 'hello' => 'he:ll:o'
function colons(s) {
    return s.replace(/(.{2})(?=.)/g, '$1:');
}
