// expediente_electronico.markdoc.ts

import { Schema, Tag } from '@markdoc/markdoc';
import { MainUtils } from '../../HostMachine';
import { GetMarkdocView } from '../views/ViewsPath';
export const Expediente: Schema = {
  render: 'Expediente',
  // children: ['paragraph'],
  attributes: {
    type: {
      type: String,
      default: "note",
      matches: ["caution", "check", "note", "warning"],
      errorLevel: "critical"
    },
    title: { type: String, required: true }
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    return `<div class="expediente ${attributes.type}"><h2>${attributes.title}</h2>${node.transformChildren(config).join('')}</div>`;
  },
}

export const Curiosidad_rubik_cube: Schema = {
  render: 'Curiosidad_rubik_cube',
  // children: ['paragraph'],
  attributes: {

    title: { type: String, default: "THE CUBE!!" },
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);

    const codepen = new Tag(
      MainUtils.render_ejs_path_file(GetMarkdocView('code_pen'),
        {
          code: 'Yzgqwxw',
          user: 'Fabian-Balmaceda',
          attributes,
        }));


    return codepen;

  },
  description: `
// Utilizar este mardoc tag, para mostrar una curiosidad de el cubo rubik!
// {% Curiosidad_rubik_cube title="Titulo Hyper llamativo" %}
  `.trim()
}
