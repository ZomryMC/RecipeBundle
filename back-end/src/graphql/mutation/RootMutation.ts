import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { SessionData } from '../../model/SessionData';
import { writeMenuChangeToDatabase } from './helpers/WriteMenuChangeToDatabase';
import { ModifyMenuResponse } from './ModifyMenuResponse';
import { updateIngredientsPurchasedResponse } from './UpdateIngredientsPurchasedResponse';

export const RootMutation = new GraphQLObjectType({
    name: 'menuManagement',
    fields: {
        addMenu: {
            type: ModifyMenuResponse,
            description: 'Plan a recipe as a new menu item',
            args: {
                date: { type: new GraphQLNonNull(GraphQLFloat), description: 'The date to plan the menu on. Unix Epoch in milliseconds.' },
                recipeId: { type: new GraphQLNonNull(GraphQLInt), description: 'The identifier of the menu to add.' }
            },
            async resolve(parentValue, args, request) {
                try {
                    const menuId = await writeMenuChangeToDatabase((request.session as SessionData).userId!, {
                        date: args.date,
                        menuId: 0,
                        recipeId: args.recipeId,
                        ingredientsBought: false
                    }, 'add');

                    return {
                        success: true,
                        menuId
                    };
                } catch (err) {
                    return {
                        success: false,
                        error: err
                    };
                }
            }
        },
        removeMenu: {
            type: ModifyMenuResponse,
            description: 'Remove a recipe as a planned menu item',
            args: {
                menuId: { type: new GraphQLNonNull(GraphQLInt), description: 'The identifier of the menu to remove.' }
            },
            async resolve(parentValue, args, request) {
                try {
                    const menuId = await writeMenuChangeToDatabase((request.session as SessionData).userId!, {
                        date: 0,
                        menuId: args.menuId,
                        recipeId: 0,
                        ingredientsBought: false
                    }, 'remove');

                    return {
                        success: true,
                        menuId
                    };
                } catch (err) {
                    return {
                        success: false,
                        error: err
                    };
                }
            }
        },
        updateMenu: {
            type: ModifyMenuResponse,
            description: 'Move a planned menu to another date.',
            args: {
                date: { type: new GraphQLNonNull(GraphQLFloat), description: 'The date to move the menu to. Unix Epoch in milliseconds.' },
                menuId: { type: new GraphQLNonNull(GraphQLInt), description: 'The identifier of the menu to move.' }
            },
            async resolve(parentValue, args, request) {
                try {
                    const menuId = await writeMenuChangeToDatabase((request.session as SessionData).userId!, {
                        date: args.date,
                        menuId: args.menuId,
                        recipeId: 0,
                        ingredientsBought: false
                    }, 'update');

                    return {
                        success: true,
                        menuId
                    };
                } catch (err) {
                    return {
                        success: false,
                        error: err
                    };
                }
            }
        },
        updateMenuIngredientsBought: {
            type: updateIngredientsPurchasedResponse,
            description: 'Mark the ingredients of a menu as bought.',
            args: {
                menuIds: { type: new GraphQLNonNull(new GraphQLList(GraphQLInt)), description: 'The identifier of the menus to update.' },
                isBought: { type: new GraphQLNonNull(GraphQLBoolean), description: 'Boolean indicating if all ingredients have been bought.' },
            },
            async resolve() {
                return Promise.resolve({
                    success: true
                });
            }
        }
    }
});