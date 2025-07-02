import { defineConfig } from "@graphql-hive/gateway";
import { getComposedSchemaFromConfig } from "@graphql-mesh/compose-cli";
import { DefaultLogger } from "@graphql-mesh/utils";
import { composeConfig } from "./mesh.config";

export const gatewayConfig = defineConfig({
  supergraph: () => {
    return getComposedSchemaFromConfig(composeConfig, new DefaultLogger());
  },
});
