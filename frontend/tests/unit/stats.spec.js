import {describe, it, expect, afterEach} from 'vitest'
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { mount } from '@vue/test-utils'
import Stats from '../../src/components/StatsComponent.vue'

describe('Stats page', () => {
    const mock = new MockAdapter(axios);

    afterEach(() => {
        mock.reset();
    });

    it('Check correct value for current year for personal and average ', function () {
        const wrapper = mount(Stats)
        expect(wrapper.vm.personalChosenYear).toBe(new Date().getFullYear())
        expect(wrapper.vm.averageChosenYear).toBe(new Date().getFullYear())
        expect(wrapper.vm.chartYear).toBe(new Date().getFullYear())
    });

    it('test changeData method changes year value for chart', function () {
        const wrapper = mount(Stats)
        wrapper.vm.changeData(2022)
        expect(wrapper.vm.chartYear).toBe(2022)
    });
})
