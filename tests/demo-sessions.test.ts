import { describe, expect, it } from 'vitest';
import { createDemoSessions } from '../server/services/demoSessions';

describe('Serverless demo sessions', () => {
  it('validates login tokens on independent function instances', () => {
    const loginInstance = createDemoSessions('test-only-deployment-secret');
    const dashboardInstance = createDemoSessions('test-only-deployment-secret');
    const token = loginInstance.issue('usr_student_1');
    expect(dashboardInstance.read(token)?.userId).toBe('usr_student_1');
  });
  it('rejects tampering and a different deployment secret', () => {
    const sessions = createDemoSessions('test-one');
    const token = sessions.issue('usr_customer_1');
    const [,signature] = token.split('.');
    const forged = Buffer.from(JSON.stringify({ userId:'usr_admin_1', expires:Date.now()+999999 })).toString('base64url')+'.'+signature;
    expect(sessions.read(forged)).toBeUndefined();
    expect(createDemoSessions('test-two').read(token)).toBeUndefined();
    expect(sessions.read('malformed')).toBeUndefined();
  });
  it('expires tokens and revokes them in the current instance', () => {
    let now = 1000;
    const sessions = createDemoSessions('test-three', () => now);
    const expired = sessions.issue('usr_student_1');
    now += 8*60*60*1000;
    expect(sessions.read(expired)).toBeUndefined();
    const revoked = sessions.issue('usr_student_1');
    sessions.revoke(revoked);
    expect(sessions.read(revoked)).toBeUndefined();
  });
});
