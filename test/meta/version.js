/* global describe, it*/
import assert from 'assert';
import { parse as parseVersion } from '../../src/meta/version';

describe('parseVersion', () => {
  it('should parse valid formats', () => {
    let parsed = parseVersion('1.0');
    assert(parsed.major === 1);
    assert(parsed.minor === 0);
    assert(parsed.patch === 0);
    assert(parsed.channel === 'release');
    assert(parsed.isMajor);

    parsed = parseVersion('1.2.3');
    assert(parsed.major === 1);
    assert(parsed.minor === 2);
    assert(parsed.patch === 3);
    assert(!parsed.isMajor);

    assert(parseVersion('1.0.2').major === 1);
    assert(parseVersion('1.0.2').minor === 0);
    assert(parseVersion('1.0.2').patch === 2);

    assert(parseVersion('1.0b2').channel === 'beta');
    assert(parseVersion('1.0b2').candidate === 2);

    assert(parseVersion('1.0a2').channel === 'aurora');
    assert(parseVersion('1.0a2').candidate === 2);

    assert(parseVersion('1.2.3esr').channel === 'esr');
    assert(parseVersion('1.2.3esr').minor === 2);
    assert(parseVersion('1.2.3esr').patch === 3);
  });
});
