import preferObjectSpreadForExactObjectMap from "./rules/prefer-object-spread-for-exact-object-map"
import preferPickForObjectSubsetMap from "./rules/prefer-pick-for-object-subset-map"

export default {
  meta: {
    name: "object-map",
  },
  rules: {
    "prefer-object-spread-for-exact-object-map":
      preferObjectSpreadForExactObjectMap,
    "prefer-pick-for-object-subset-map": preferPickForObjectSubsetMap,
  },
}
