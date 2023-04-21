package idatt2106v231.backend.service;

import idatt2106v231.backend.dto.item.CategoryDto;

import idatt2106v231.backend.model.Category;
import idatt2106v231.backend.repository.CategoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryServices {


    private CategoryRepository categoryRepository;

    @Autowired
    public void setCategoryRepository(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    private final ModelMapper mapper = new ModelMapper();


    /**
     * Method to save a new category to database
     *
     * @param categoryDto the new category
     * @return true if the is saved
     */
    public boolean saveCategory(CategoryDto categoryDto){
        try {
            Category cat = mapper.map(categoryDto, Category.class);
            categoryRepository.save(cat);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Method to delete a category from database
     *
     * @param categoryId the category id
     * @return true if the category exists and is deleted
     */
    public boolean deleteCategory(int categoryId){
        if (categoryExist(categoryId)){
            categoryRepository.deleteById(categoryId);
            return true;
        }
        return false;
    }

    /**
     * Method to get a category, returns null if the category does not exist
     *
     * @param categoryId the category id
     * @return the category
     */
    public CategoryDto getCategory(int categoryId){
        if (categoryExist(categoryId)){
            return mapper.map(categoryRepository.findById(categoryId).get(), CategoryDto.class);
        }
        return null;
    }

    /**
     * Method to get all categories
     *
     * @return all categories
     */
    public List<CategoryDto> getAllCategories(){
        List<CategoryDto> list = new ArrayList<>();
        categoryRepository.findAll().forEach(obj -> list.add(mapper.map(obj, CategoryDto.class)));
        return list;
    }

    /**
     * Method to assert a category exists by id
     *
     * @param categoryId the category id
     * @return true if the category exists
     */
    public boolean categoryExist(int categoryId){
        return categoryRepository.findById(categoryId).isPresent();
    }

    /**
     * Method to assert a category exists by description
     *
     * @param description the category description
     * @return true if the category exists
     */
    public boolean categoryExist(String description){
        return categoryRepository.findByDescription(description).isPresent();
    }
}