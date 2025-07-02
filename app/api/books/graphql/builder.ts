import SchemaBuilder from "@pothos/core";
import DirectivePlugin from "@pothos/plugin-directives";
import FederationPlugin from "@pothos/plugin-federation";

export const builder = new SchemaBuilder<{
  DefaultFieldNullability: false;
}>({
  plugins: [DirectivePlugin, FederationPlugin],
  defaultFieldNullability: false,
});
