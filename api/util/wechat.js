function fetchContactType(contactPayload) {
    let id = contactPayload.id 
    if (id.startsWith("gh_")) {
        return 'official'
    } 
    return 'personal'
}

module.exports = {
    fetchContactType
}