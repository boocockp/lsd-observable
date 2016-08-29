function bindFunctions(obj) {
    const prototype = obj.constructor.prototype
    const protoPropNames = Object.getOwnPropertyNames(prototype)
    protoPropNames.filter( p => p !== 'constructor' && !p.startsWith('_') )
        .forEach( p => {
            const desc = Object.getOwnPropertyDescriptor(prototype, p)
            if (typeof desc.value === 'function') {
                Object.defineProperty(obj, p, {value: desc.value.bind(obj)})
            }
        } )
}

module.exports = {bindFunctions}
