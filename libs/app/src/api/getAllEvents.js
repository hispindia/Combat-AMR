import { get, reques } from '@hisp-amr/api'
export const getAllEvents = async (ou, teiId) =>{
    var url = `events.json?orgUnit=${ou}&trackedEntityInstance=${teiId}&paging=false`
    let response = await get(url);
    return response;
}

export const getPersonVal = async teiId =>
    await get(
        request('trackedEntityInstances/' + teiId + '.json', {
            fields: '',
        })
    )