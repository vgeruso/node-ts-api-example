import bcrypt from 'bcrypt';

import { encrypt } from '../../src/util/crypt';

describe('Encrypt password', () => {
  it('should encrypt password', async () => {
    const pass = '1234'
    const hash = await encrypt(pass, 10);
    const compare = await bcrypt.compare(pass, hash);

    expect(compare).toBeTruthy();
  });
});