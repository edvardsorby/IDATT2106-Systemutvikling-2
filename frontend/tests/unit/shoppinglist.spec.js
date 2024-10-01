import {describe, it, expect, afterEach} from 'vitest'

import { mount } from '@vue/test-utils'
import ShoppingListComponent from '../../src/components/ShoppingListComponent.vue'
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

describe('ShoppingListView.vue test', () => {
    const mock = new MockAdapter(axios);

    afterEach(() => {
        mock.reset();
    });

    it('initializes with correct elements', () => {
        const wrapper = mount(ShoppingListComponent)
        expect(wrapper.find('#shoppinglist-title').text()).toBe('Shopping list')
        expect(wrapper.find("#input").text()).toBe('')
        expect(wrapper.find("#buy-shoppinglist-tooltip").text()).toBe('Add selected items to fridge')
        expect(wrapper.find("#add-recommended-shoppinglist-tooltip").text()).toBe('Add recommended items to shopping list')
    })

    it('correctly getting list of all items', async () => {
        const wrapper = mount(ShoppingListComponent)

        const mockList = [
            { name: 'eggs', categoryId: 1 },
            { name: 'milk', categoryId: 1 },
            { name: 'cheese', categoryId: 1 },
        ];
        mock.onGet('http://localhost:8080/api/items/getAllItems').reply(200, mockList);
        await wrapper.vm.getAllItems()
        expect(wrapper.vm.allItems).toEqual(['eggs', 'milk', 'cheese']);
    })

    it('check edit item not possible if child user ', function () {
        const wrapper = mount(ShoppingListComponent)
        wrapper.vm.childUser = true
        const item = {
            "name": "milk"
        }
        wrapper.vm.editItem(item)
        expect(wrapper.vm.snackbarText).toBe("You are not authorized to edit items")
        expect(wrapper.vm.showSnackbar).toBe(true)
    });

    it('check edit item possible if not child user ', function () {
        const wrapper = mount(ShoppingListComponent)
        wrapper.vm.childUser = false
        const item = {
            "name": "Milk"
        }
        wrapper.vm.editItem(item)
        expect(wrapper.vm.editedItem.itemName).toBe("Milk")
        expect(wrapper.vm.disableNameEdit).toBe(true)
        expect(wrapper.vm.showDialogWindow).toBe(true)
    });

    it('check if close method sets correct values ', function () {
        const wrapper = mount(ShoppingListComponent)
        wrapper.vm.close()
        expect(wrapper.vm.disableNameEdit).toBe(false)
        expect(wrapper.vm.showDialogWindow).toBe(false)
    });

    it('check isInt and isPositive methods ', function () {
        const wrapper = mount(ShoppingListComponent)
        expect(wrapper.vm.isInt("test")).toEqual("The value must be an integer number")
        expect(wrapper.vm.isInt(3)).toEqual(true)
        expect(wrapper.vm.isPositive("test")).toEqual("The value must be greater than zero")
        expect(wrapper.vm.isPositive(3)).toEqual(true)
    });

    it('check cannot buy if child ', function () {
        const wrapper = mount(ShoppingListComponent)
        wrapper.vm.childUser = true
        wrapper.vm.buy()
        expect(wrapper.vm.snackbarText).toEqual("You are not authorized to buy items")
        expect(wrapper.vm.showSnackbar).toEqual(true)
    });

    it('check cannot remove item if child ', function () {
        const wrapper = mount(ShoppingListComponent)
        wrapper.vm.childUser = true
        const item = {
            "name": "Milk"
        }
        wrapper.vm.removeList(item)
        expect(wrapper.vm.snackbarText).toEqual("You are not authorized to remove items")
        expect(wrapper.vm.showSnackbar).toEqual(true)
    });

    it('sets correct user level from localstorage value ', function () {
        const wrapper = mount(ShoppingListComponent)
        localStorage.setItem("userType", "false")
        wrapper.vm.setUserLevel()
        expect(wrapper.vm.childUser).toBe(true)

        localStorage.setItem("userType", "true")
        wrapper.vm.setUserLevel()
        expect(wrapper.vm.childUser).toBe(false)
    });
})
