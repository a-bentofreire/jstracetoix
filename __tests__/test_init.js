import { c__, d__, init__, t__ } from '../node/jstracetoix.mjs';
import { threadId } from 'worker_threads';
import { Writable } from 'stream';

function callEqual(data, expected) {
    expect(data['output__']).toBe(expected);
    return false;
}

describe('TestInitInputFormat', () => {

    beforeEach(() => {
        init__({ format: { input: 'vk{name}:`cz{value}`', sep: ' | ' } });
    });

    afterEach(() => {
        init__();
    });

    test('test_display_format', () => {
        d__([0, 1].map(i =>
            c__(i + 1)),
            { before: (data) => callEqual(data, "vki0:`cz1` | vki1:`cz2` | ") });
    });
});

describe('TestInitInputNoSepFormat', () => {

    beforeEach(() => {
        init__({ format: { input: 'jk{name}:`lz{value}`' } });
    });

    afterEach(() => {
        init__();
    });

    test('test_display_format', () => {
        d__([0, 1].map(i =>
            c__(i + 1)),
            { before: (data) => callEqual(data, "jki0:`lz1`jki1:`lz2`") });
    });
});

describe('TestInitResultFormat', () => {

    beforeEach(() => {
        init__({ format: { result: 'pp{name}:`ii{value}`' } });
    });

    afterEach(() => {
        init__();
    });

    test('test_display_format', () => {
        d__([0, 1].map(i =>
            c__(i + 1)),
            { before: (data) => callEqual(data, "pp_:`ii[1,2]`") });
    });
});

describe('TestInitThreadFormat', () => {

    beforeEach(() => {
        init__({ multithreading: true, format: { result: 'uu{name}:`vv{value}`', thread: 'k{id}o' } });
    });

    afterEach(() => {
        init__();
    });

    test('test_display_format', () => {
        d__([0, 1].map(i =>
            c__(i + 3)),
            { before: (data) => callEqual(data, `k${threadId}ouu_:\`vv[3,4]\``) });
    });
});

describe('TestInitStream', () => {

    let received;

    class MockWritableStream extends Writable {
        write(chunk) {
            received = chunk;
        }
    }

    beforeEach(() => {
        init__({ stream: new MockWritableStream() });
    });

    afterEach(() => {
        expect(received).toEqual("i0:`2` | i1:`3` | _:`[2,3]`\n");
        init__();
    });

    test('test_display_format', () => {
        d__([0, 1].map(i =>
            c__(i + 2)));
    });
});

describe('TestInitMultiThread', () => {

    beforeEach(() => {
        init__({ multithreading: true });
    });

    afterEach(() => {
        init__();
    });

    test('test_display_format', () => {
        d__([0, 1].map(i =>
            c__(i + 2)),
            { before: (data) => callEqual(data, `${threadId}: i0:\`2\` | i1:\`3\` | _:\`[2,3]\``) });
    });
});
