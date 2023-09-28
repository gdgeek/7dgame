import Blockly from 'blockly'
import EventType from './type'

import Helper from '../helper'
const data = {
  name: 'execute'
}
const block = {
  title: data.name,
  type: EventType.name,
  colour: EventType.colour,
  getBlockJson({ resource }) {
    const json = {
      type: 'block_type',
      message0: '任务执行 %1',
      args0: [
        {
          type: 'input_value',
          name: 'content',
          check: 'Task'
        }
      ],
      inputsInline: true,
      colour: EventType.colour,
      tooltip: '',
      helpUrl: ''
    }
    return json
  },
  getBlock: function (parameters) {
    const data = {
      init: function () {
        const json = block.getBlockJson(parameters)
        this.jsonInit(json)
      }
    }
    return data
  },
  getLua({ index }) {
    const lua = function (block) {
      var statements_content = Blockly.Lua.statementToCode(block, 'content')

      //var statements_content = Blockly.Lua.statementToCode(block, 'content')
      // TODO: Assemble Lua into code variable.
      var code = '..'
      /*
     
*/

      var execute = '_G.helper.task_execute(' + statements_content + ')\n'
      var code =
        "verse['$main'] = function(parameter) \n  is_playing = true\n" +
        execute +
        '  is_playing = false\nend\n'
      return code
    }
    return lua
  },
  toolbox: {
    kind: 'block',
    type: data.name
  }
}
export default block
