import {describe, it, expect, afterEach} from 'vitest'
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { mount } from '@vue/test-utils'
import Recipe from '../../src/components/RecipeComponent.vue'

describe('Recipe page', () => {
    const mock = new MockAdapter(axios);

    afterEach(() => {
        mock.reset();
    });

    it('renders with slider for menus', () => {
        const wrapper = mount(Recipe)
        expect(wrapper.find('#menu').exists()).toBe(true)
    })

    it('generate menus', () => {
        const wrapper = mount(Recipe)
    })

})
