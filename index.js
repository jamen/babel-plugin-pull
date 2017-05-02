
module.exports = transform_pull

function transform_pull (babel) {
  const t = babel.types
  
  const PIPE_OP = { operator: '|' }

  // Find pipeline operators
  return {
    visitor: {
      BinaryExpression: path => {
        if (!path.isBinaryExpression(PIPE_OP)) return
        if (no_pipe(path) === true) return

        // Replace the chain with `pull` call expression
        var call = t.callExpression(t.identifier('pull'), stream_list(path.node))
        path.replaceWith(call)
      }
    }
  }
}

function stream_list (node) {
  let list = [node.right]
  let walking = [node.left]

  while (walking.length) {
    let select = walking.pop()
    if (select.type === 'BinaryExpression' && select.operator === '|') {
      walking.push(select.left)
      list.unshift(select.right)
    } else {
      list.unshift(select)
    }
  }

  return list
}

function no_pipe (path) {
  return !!path.findParent(path => {
    const directives = path.node.directives
    if (directives === undefined) return
    return directives.some(d => {
      return d.value.value === 'no pipe'
    })
  })
}
