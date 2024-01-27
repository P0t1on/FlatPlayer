import { EntityConfig } from "$lib/types"
import type { Entity } from "$lib/types"

const deco: () => ClassDecorator = () => (target) => {

}

const entity: Entity = {
    name: "",
    sprite: "",
    module: "",
    config: EntityConfig.NONE
}