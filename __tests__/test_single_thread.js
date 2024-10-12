import { c__, d__, init__, t__ } from '../node/jstracetoix.mjs';

describe('TestSingleThread', () => {
    function callEqual(data, expected) {
        expect(data['output__']).toBe(expected);
        return false;
    }

    test('arrow_no_inputs', () => {
        (o =>
            d__(o + 1, {
                before: (data) => callEqual(data, "_:`16`")
            }))(15);
    });

    test('arrow_with_inputs', () => {
        (o =>
            d__(c__(o) + c__(o + 1), {
                before: (data) => callEqual(data, "i0:`5` | i1:`6` | _:`11`")
            }))(5);
    });

    test('arrow_array', () => {
        (o =>
            d__([...c__(o), ...c__([o[0] + 1])], {
                before: (data) => callEqual(data, "i0:`[7]` | i1:`[8]` | _:`[7,8]`")
            }))([7]);
    });

    test('expression_levels', () => {
        const [x, y, w, k, u] = [1, 2, 3, 4 + 4, x => x];
        d__(c__(x) + y * c__(w) + d__(k * c__(u(5), { level: 1 }), {
            before: (data) => callEqual(data, "i0:`5` | _:`40`")
        }), {
            before: (data) => callEqual(data, "i0:`1` | i1:`3` | _:`47`")
        });
    });

    test('method_chaining_array', () => {
        d__(['.png', '.jpg', '.gif'].filter(ext => c__(ext) === '.jpg'), {
            before: (data) => callEqual(data, "i0:`.png` | i1:`.jpg` | i2:`.gif` | _:`[\".jpg\"]`")
        });
    });

    test('arrow_input_name', () => {
        (o =>
            d__(c__(o, { name: 'p1' }), {
                before: (data) => callEqual(data, "p1:`6` | _:`6`")
            }))(6);
    });

    test('method_chaining_double_input_name', () => {
        d__([
            [10, 20],
            [30, 40]
        ].map(([x, y]) => 5 * c__(y, { name: `y${x}` }) * c__(x, { name: `x${y}` })),
            {
                before: (data) =>
                    callEqual(data, "y10:`20` | x20:`10` | y30:`40` | x40:`30` | _:`[1000,6000]`")
            }
        );
    });

    test('arrow_display_name', () => {
        (o =>
            d__(c__(o) + 1, {
                name: 'f2',
                before: (data) => callEqual(data, "i0:`8` | f2:`9`")
            }))(8);
    });

    test('capture_allow_index', () => {
        d__(
            [...Array(6).keys()].map(i =>
                c__(i, {
                    allow: (index) => index === 1 || index === 4
                })
            ),
            {
                before: (data) => callEqual(data, "i0:`1` | i1:`4` | _:`[0,1,2,3,4,5]`")
            }
        );
    });

    test('capture_allow_name', () => {
        d__(
            [...Array(6).keys()].map(i =>
                c__(i, {
                    allow: (_, name) => name[1] === '0' || name[1] === '1' || name[1] === '2'
                })
            ),
            {
                before: (data) => callEqual(data, "i0:`0` | i1:`1` | i2:`2` | _:`[0,1,2,3,4,5]`")
            }
        );
    });

    test('capture_allow_value', () => {
        d__(
            [...Array(10).keys()].map(i =>
                c__(i, {
                    allow: (_, __, value) => value > 2 && value < 5
                })
            ),
            {
                before: (data) => callEqual(data, "i0:`3` | i1:`4` | _:`[0,1,2,3,4,5,6,7,8,9]`")
            }
        );
    });

    test('test_capture_allow_value_override', () => {
        d__([['10', '20'], ['30', '40'], ['50', '60']].map(i =>
            c__(i, { allow: (_, __, value) => value[0] })),
            { before: (data) => callEqual(data, "i0:`10` | i1:`30` | i2:`50` | _:`[[\"10\",\"20\"],[\"30\",\"40\"],[\"50\",\"60\"]]`") });
    });

    test('test_capture_allow_index_with_name_index', () => {
        d__([...Array(6).keys()].map(i =>
            c__(i, { allow: (index, _, __) => index === 1 || index === 4, name: (index, _, __) => `x${index + 1}` })),
            { before: (data) => callEqual(data, "x2:`1` | x5:`4` | _:`[0,1,2,3,4,5]`") });
    });

    test('test_capture_allow_index_with_name_allow_index', () => {
        d__([...Array(6).keys()].map(i =>
            c__(i, { allow: (index, _, __) => index === 1 || index === 4, name: (_, allow_index, __) => `y${allow_index}` })),
            { before: (data) => callEqual(data, "y0:`1` | y1:`4` | _:`[0,1,2,3,4,5]`") });
    });

    test('test_capture_allow_index_with_name_allow_value', () => {
        d__([...Array(6).keys()].map(i =>
            c__(i, { allow: (index, _, __) => index === 1 || index === 4, name: (_, __, value) => `z${value}` })),
            { before: (data) => callEqual(data, "z1:`1` | z4:`4` | _:`[0,1,2,3,4,5]`") });
    });
});
