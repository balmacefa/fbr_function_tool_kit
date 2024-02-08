import { convert_form_ToNestedObject_lodash_style } from "./Parse_input_structure";

describe('convert_form_ToNestedObject_lodash_style', () => {
    it('should correctly convert flat object with delimited keys into a nested object', () => {
        const input = {
            'search_filters.highlight': true,
            'search_filters.indexSize': 1024
        };
        const expected = {
            search_filters: { highlight: true, indexSize: 1024 }
        };
        expect(convert_form_ToNestedObject_lodash_style(input)).toEqual(expected);
    });

    it('should handle empty object', () => {
        expect(convert_form_ToNestedObject_lodash_style({})).toEqual({});
    });

    it('should handle non-delimited keys', () => {
        const input = { 'simpleKey': 'value' };
        const expected = { 'simpleKey': 'value' };
        expect(convert_form_ToNestedObject_lodash_style(input)).toEqual(expected);
    });

    it('should handle special values like null and undefined', () => {
        const input = { 'key1.key2': null, 'key3': undefined };
        const expected = { 'key1': { 'key2': null }, 'key3': undefined };
        expect(convert_form_ToNestedObject_lodash_style(input)).toEqual(expected);
    });

    it('should correctly handle nested arrays with indexed keys', () => {
        const input = {
            'presunta_victima.i0.nombre': 'A',
            'presunta_victima.i1.nombre': 'B',
            'presunta_victima.i2.nombre': 'C'
        };
        const expected = {
            presunta_victima: [{ nombre: 'A' }, { nombre: 'B' }, { nombre: 'C' }]
        };
        const result = convert_form_ToNestedObject_lodash_style(input);
        expect(result).toEqual(expected);
    });

    it('should correctly handle multiple nested properties and nested arrays', () => {
        const input = {
            'department.i0.team.i0.memberName': 'Alice',
            'department.i0.team.i0.memberRole': 'Developer',
            'department.i0.team.i1.memberName': 'Bob',
            'department.i1.team.i0.memberName': 'Charlie',
            'department.i1.team.i0.memberRole': 'Designer',
            'department.i1.team.i1.memberName': 'Carlos',
            'department.i1.team.i1.role.system': 'admin',
            'department.i1.team.i1.role.dashboard': 'viewer',
            'department.i1.location': 'Building B'
        };
        const expected = {
            department: [
                {
                    team: [
                        { memberName: 'Alice', memberRole: 'Developer' },
                        { memberName: 'Bob' }
                    ]
                },
                {
                    team: [
                        { memberName: 'Charlie', memberRole: 'Designer' },
                        {
                            memberName: 'Carlos', role: {
                                system: 'admin',
                                dashboard: 'viewer'
                            }
                        },
                    ],
                    location: 'Building B'
                }
            ]
        };


        const result = convert_form_ToNestedObject_lodash_style(input);
        expect(result).toEqual(expected);
    });

    // Additional tests for edge cases or invalid inputs can be added here.
});
