import noSingleUseConst from "./rules/no-single-use-const"
import preferObjectSpreadForExactObjectMap from "./rules/prefer-object-spread-for-exact-object-map"
import preferPickForObjectSubsetMap from "./rules/prefer-pick-for-object-subset-map"

export default {
  meta: {
    name: "zachs-rules",
  },
  rules: {
    "no-single-use-const": noSingleUseConst,
    "prefer-object-spread-for-exact-object-map":
      preferObjectSpreadForExactObjectMap,
    "prefer-pick-for-object-subset-map": preferPickForObjectSubsetMap,
  },
}
