import { Button, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Select } from "@chakra-ui/react";
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from "react";
import { connect } from 'react-redux';
import { Category, Ingredient, QuantityLessIngredient } from '../../interfaces/Recipe';
import { Localisation } from "../../localisation/AppTexts";
import { translateCategory } from '../../localisation/CategoryLocalisation';
import { ReduxModel } from '../../redux/Store';
import SearchInput from '../common/search/SearchInput';
import './IngredientsModal.scss';
import { createEmptyIngredient } from './RecipeEditor';

interface OwnProps {
    ingredientInputs: Ingredient;
    onConfirm: (newValue: Ingredient) => void;
    onCancel: () => void;
}

interface ReduxProps {
    categories: Category[];
    availableIngredients: QuantityLessIngredient[];
}

export const quantityDescriptions = ['stuk', 'gram', 'eetlepel', 'theelepel', 'snufje'];

function mapStateToProps(reduxState: ReduxModel): ReduxProps {
    return {
        categories: reduxState.categories,
        availableIngredients: reduxState.ingredients
    }
}

type Props = OwnProps & ReduxProps;

function IngredientsModal(props: Props) {
    const focusRef = useRef<HTMLInputElement>(null);
    const [ingredient, setIngredient] = useState<QuantityLessIngredient>(props.ingredientInputs);
    const [quantityNumber, setQuantityNumber] = useState(props.ingredientInputs.quantity_number);
    const [quantityDescription, setQuantityDescription] = useState<string>(props.ingredientInputs.quantity_description);
    const [categoryId, setCategoryId] = useState<number>(props.ingredientInputs.categoryId);
    const [showExtraOptions, setShowExtraOptions] = useState(false);
    const hasName = Boolean(ingredient?.name || focusRef.current?.value);
    const canBeSubmitted = Boolean(showExtraOptions ? hasName && quantityNumber : ingredient);
    const [searchIsActive, setSearchIsActive] = useState(false);

    useEffect(() => {
        if (!focusRef.current) {
            return;
        }

        function onFocus() {
            setSearchIsActive(true);
        }

        function onBlur() {
            const value = focusRef.current?.value || '';
            if (value && ingredient.name !== value) {
                const ingredient = createEmptyIngredient();
                ingredient.name = value;
                setIngredient(ingredient);
                setShowExtraOptions(true);
            }

            setSearchIsActive(false);
        }

        focusRef.current.addEventListener('focus', onFocus);
        focusRef.current.addEventListener('blur', onBlur);
        return () => {
            focusRef.current?.removeEventListener('blur', onFocus)
            focusRef.current?.removeEventListener('blur', onBlur);
        }
    });

    return (<Modal isOpen={true} onClose={props.onCancel} initialFocusRef={focusRef}>
        <ModalOverlay />
        <ModalContent>
            <ModalCloseButton onClick={props.onCancel} />
            <ModalBody className="add-ingredients-modal">
                <Heading as="h3">{Localisation.EDIT_INGREDIENT}</Heading>
                {Localisation.INGREDIENT_NAME}
                <SearchInput<QuantityLessIngredient>
                    selection={ingredient}
                    onRender={(ingredient) => ingredient.name}
                    items={props.availableIngredients}
                    onSelectionChange={(draftIngredient) => {
                        if (!draftIngredient) {
                            draftIngredient = createEmptyIngredient();
                            draftIngredient.name = focusRef.current?.value || '';
                            setShowExtraOptions(true);
                        }
                        setIngredient(draftIngredient);
                    }}
                    inputHasResults={(hasValidOptions) => setShowExtraOptions(!hasValidOptions)}
                    inputRef={focusRef}
                    renderResults={searchIsActive}
                    defaultValue={props.ingredientInputs.name}
                />

                <label>
                    {Localisation.QUANTITY}
                    <Input value={quantityNumber || ''}
                        onChange={(e) => setQuantityNumber(Number(e.target.value) || 0)}
                        type='number'
                        placeholder={Localisation.QUANTITY}
                    />
                </label>

                {!showExtraOptions && <div
                    className="edit-full"
                    tabIndex={0}
                    onClick={() => setShowExtraOptions(true)}
                    onKeyUpCapture={(event) => {
                        if (event.key === 'Enter') {
                            setShowExtraOptions(true);
                        }
                    }}
                >   <FontAwesomeIcon icon={faPencilAlt} /> {Localisation.EDIT_DETAILS}
                </div>}

                {showExtraOptions && <div><label>
                    {Localisation.QUANTITY_KIND}
                    <Select disabled={!showExtraOptions} value={quantityDescription} onChange={(e) => setQuantityDescription(e.target.selectedOptions[0].value)}>
                        {quantityDescriptions.map((description, index) => {
                            const capitalizedText = description.charAt(0).toUpperCase() + description.substr(1);
                            return <option key={index} value={description}>{capitalizedText}</option>
                        })}
                    </Select>
                </label>

                    <label>
                        {Localisation.CATEGORY_INGREDIENT}
                        <Select disabled={!showExtraOptions} value={categoryId} onChange={(e) => setCategoryId(Number(e.target.selectedOptions[0].value))}>
                            {props.categories.map((category) => {
                                return <React.Fragment key={category.categoryId}>
                                    <option value={category.categoryId}>
                                        {translateCategory(category.categoryName as any)}
                                    </option>
                                </React.Fragment>
                            })}
                        </Select>
                    </label>
                </div>}
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="blue" disabled={!canBeSubmitted} onClick={() => props.onConfirm({
                    name: ingredient.name,
                    quantity_number: quantityNumber,
                    quantity_description: quantityDescription,
                    id: ingredient.id,
                    categoryId,
                    categoryName: ''
                })}>{Localisation.ADD}</Button>
                <Button variant="ghost" onClick={() => props.onCancel()}>{Localisation.CANCEL}</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>);
}

export default connect(mapStateToProps)(IngredientsModal);