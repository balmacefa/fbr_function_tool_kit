# This is a executable nodebook for typescript server, using json as data flow configuration

This technology use a class base system called Om Mono Behaviour, witch act as way to register this node
into an excutable engine, so you can create servers, and instaces of it dynamilly.
and use CONTENT AS DATA WITH MARKDOC

```json
{
  "nodes": [
    {
      "name": "dbQueryNode",
      "nodeType": "DatabaseQuery",
      "inputs": [
        {
          "name": "resourceId",
          "type": "string"
        }
      ],
      "outputs": [
        {
          "name": "queryResult",
          "type": "object"
        }
      ],
      "config": {
        "query": "SELECT * FROM resources WHERE id = :resourceId"
      },
      "next": ["conditionalNode", "redisCacheNode"]
    },
    {
      "name": "conditionalNode",
      "nodeType": "Conditional",
      "inputs": [
        {
          "name": "queryResult",
          "type": "object"
        }
      ],
      "outputs": [
        {
          "name": "routePath",
          "type": "string"
        }
      ],
      "config": {
        "condition": "resourceNotFound"
      },
      "next": ["renderNode404"]
    }
    // Other nodes...
  ]
}
```
