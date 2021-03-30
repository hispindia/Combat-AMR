import { del } from './crud'
export const deleteTEI = async teiId => await del(`trackedEntityInstances/${teiId}`)
