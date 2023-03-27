import { EntityRegister } from '@/assets/js/blockly/custom/entity'
import { DataRegister } from '@/assets/js/blockly/custom/data'
import { TriggerRegister } from '@/assets/js/blockly/custom/trigger'
import { ExecuteRegister } from '@/assets/js/blockly/custom/execute'
import { TextRegister } from '@/assets/js/blockly/custom/text'
import { PolygenRegister } from '@/assets/js/blockly/custom/polygen'
import { PictureRegister } from '@/assets/js/blockly/custom/picture'
import { HelperRegister } from '@/assets/js/blockly/custom/helper/index'
import { VideoRegister } from '@/assets/js/blockly/custom/video'
import { SoundRegister } from '@/assets/js/blockly/custom/sound'
import { EventRegister } from '@/assets/js/blockly/custom/event'

function AddBlocks(parameters) {
  TriggerRegister(parameters)
  EntityRegister(parameters)
  PolygenRegister(parameters)
  DataRegister(parameters)
  TextRegister(parameters)
  PictureRegister(parameters)
  HelperRegister(parameters)
  VideoRegister(parameters)
  SoundRegister(parameters)
  EventRegister(parameters)
}

export { AddBlocks }
