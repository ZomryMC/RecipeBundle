import { RulesHandler } from '../../components/shopping-list/normalization/RulesHandler';
import { QuantifiedIngredient } from '../../interfaces/Recipe';
import { QUANTITY_DESCRIPTION_NAME, TestIngredientRule, TEST_RULE_QUANTIFY_FACTOR, TEST_RULE_TO_UNIT_NAME } from '../mock/TestIngredientRule';
import { EMPTY_TEST_CATEGORY } from './SortRecipeMap.test';

const TEST_INGREDIENT_NAME = 'testing-ingredient';
const TEST_INGREDIENT: QuantifiedIngredient = {
    name: TEST_INGREDIENT_NAME,
    quantity_description: QUANTITY_DESCRIPTION_NAME,
    quantity_number: 1,
    id: -1,
    categoryId: -1,
    category: EMPTY_TEST_CATEGORY
};

describe('RulesHandler', () => {
    let rulesHandler: RulesHandler;
    describe('with a TestHandler', () => {
        beforeEach(() => {
            rulesHandler = new RulesHandler([new TestIngredientRule()]);   
        })
        
        describe('calls normalize_ with one test ingredient', () => {
            let result: QuantifiedIngredient[];

            beforeEach(() => {
                result = rulesHandler.normalize([TEST_INGREDIENT]);
            });

            test('keeps exactly one ingredient', () => {
                expect(result.length).toBe(1);
            });

            test(`keeps the ingredient name to ${TEST_INGREDIENT_NAME}`, () => {
                expect(result[0].name).toBe(TEST_INGREDIENT_NAME)
            });

            test(`multiplies the quantity to ${TEST_RULE_QUANTIFY_FACTOR}`, () => {
                expect(result[0].quantity_number).toBe(TEST_RULE_QUANTIFY_FACTOR);
            });

            test(`updates to quantity name to ${TEST_RULE_TO_UNIT_NAME}`, () => {
                expect(result[0].quantity_description).toBe(TEST_RULE_TO_UNIT_NAME)
            })
        })
    })
})