import logger from '../../logging';
import { getTypedKeys } from '../../utils';
import { TomData } from './tom.service';

type TomPollenIndicies = TomData["timelines"][0]["intervals"][0]["values"]

const tomPollenIndexToLabelMap = {
  [0]: 'None',
  [1]: 'Very low',
  [2]: 'Low',
  [3]: 'Medium',
  [4]: 'High',
  [5]: 'Very High'
}