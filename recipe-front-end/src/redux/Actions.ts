import { Dispatch } from "redux";
import { AddRecipeResponse } from "../interfaces/AddRecipeResponse";
import { Recipe } from "../interfaces/Recipe";
import { Actions, AddMenuAction, AddRecipeAction, ChangeViewAction, DayMenu, LogoutAction, OpenedMenu, RemoveMenuAction, SwitchActiveRecipeAction, ToggleMenuAction, ViewType } from "./Store";

export function changeActiveView(view: ViewType, recipe: Recipe | undefined): ChangeViewAction {
    return {
        type: Actions.CHANGE_VIEW,
        view,
        recipe
    };
}

export enum Direction {
    PREVIOUS,
    NEXT
}

export function switchActiveRecipe(direction: Direction): SwitchActiveRecipeAction {
    return {
        type: Actions.SWITCH_ACTIVE_RECIPE,
        direction
    }
}

export function switchMenu(menu: OpenedMenu): ToggleMenuAction {
    return {
        type: Actions.TOGGLE_MENU,
        menu
    }
}

export function doLogOut(dispatch: Dispatch<LogoutAction>): () => Promise<void> {
    return async function (): Promise<void> {
        try {
            await fetch('/logout');
            dispatch({ type: Actions.LOG_OUT });
        } catch (err) {
            console.log('logout failed', err);
        }
    }
}

export type AddRecipeReturn = (recipe: Recipe, formData: FormData) => Promise<void>;
export function addRecipe(dispatch: Dispatch<AddRecipeAction>,): AddRecipeReturn {
    return async function (recipe: Recipe, formData: FormData): Promise<void> {
        const response = await fetch('/addRecipe', {
            method: 'POST',
            body: formData
        });
        const responseData = await response.json() as AddRecipeResponse;

        if (responseData.error) {
            throw new Error(responseData.error);
        }

        try {
            const id = responseData.recipeId;
            if (typeof id !== 'number') {
                throw new Error('No id');
            }

            recipe.id = id;
            dispatch({
                type: Actions.ADD_RECIPE,
                recipe: recipe
            })
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}

export function addMenu(dispatch: Dispatch<AddMenuAction>): (menu: DayMenu) => Promise<void> {
    return async function (menu: DayMenu): Promise<void> {
        try {
            await fetch('/addMenu', {
                method: 'POST',
                body: JSON.stringify({
                    date: menu.date,
                    recipeId: menu.recipe.id
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            dispatch({
                type: Actions.ADD_MENU,
                menu
            });
        } catch (err) {
            console.log('adding menu failed', err);
        }
    }
}

export function removeMenu(dispatch: Dispatch<RemoveMenuAction>): (menu: DayMenu) => Promise<void> {
    return async function (menu: DayMenu): Promise<void> {
        try {
            await fetch('/removeMenu', {
                method: 'POST',
                body: JSON.stringify({
                    date: menu.date,
                    recipeId: menu.recipe.id
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            dispatch({
                type: Actions.REMOVE_MENU,
                menu
            })
        } catch (err) {
            console.log('removing menu failed', err);
        }
    }
}
