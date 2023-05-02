package idatt2106v231.backend.service;

import idatt2106v231.backend.dto.item.ItemDto;
import idatt2106v231.backend.dto.shoppinglist.ItemInShoppingListCreationDto;
import idatt2106v231.backend.dto.shoppinglist.ItemShoppingListDto;
import idatt2106v231.backend.dto.shoppinglist.ShoppingListDto;
import idatt2106v231.backend.dto.shoppinglist.WeeklyMenuShoppingListDto;
import idatt2106v231.backend.enums.Measurement;
import idatt2106v231.backend.model.Category;
import idatt2106v231.backend.model.ItemShoppingList;
import idatt2106v231.backend.repository.*;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShoppingListServices {

    private final ItemRepository itemRepository;

    //@Autowired
    private final ShoppingListRepository shoppingListRepository;

    //@Autowired
    private final ItemShoppingListRepository itemShoppingListRepository;

    private final SubUserRepository subUserRepository;

    private final AiServices aiServices;

    private final CategoryRepository categoryRepository;

    private final ItemServices itemServices;

    private final ModelMapper mapper = new ModelMapper();

    /*@Autowired
    public void setItemRepository(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }*/

    @Autowired
    public ShoppingListServices(ItemRepository itemRepository, ShoppingListRepository shoppingListRepository,
                                ItemShoppingListRepository itemShoppingListRepository, AiServices aiServices,
                                CategoryRepository categoryRepository, ItemServices itemServices, SubUserRepository subUserRepository) {
        this.itemRepository = itemRepository;
        this.shoppingListRepository = shoppingListRepository;
        this.itemShoppingListRepository = itemShoppingListRepository;
        this.subUserRepository = subUserRepository;
        this.aiServices = aiServices;
        this.categoryRepository = categoryRepository;
        this.itemServices = itemServices;

        TypeMap<ItemShoppingList, ItemShoppingListDto> propertyMapper = mapper.createTypeMap(ItemShoppingList.class, ItemShoppingListDto.class);
        propertyMapper.addMappings(mapper -> mapper.map(obj -> obj.getSubUser().isAccessLevel(), ItemShoppingListDto::setSubUserAccessLevel));
        TypeMap<ItemShoppingListDto, ItemShoppingList> propertyMapper2 = mapper.createTypeMap(ItemShoppingListDto.class, ItemShoppingList.class);
        //propertyMapper.addMappings(mapper -> mapper.map(obj -> obj.getShoppingList().getShoppingListId(), ItemShoppingList::setShoppingList));
        //propertyMapper2.addMappings(mapper -> mapper.map(obj -> this.itemRepository.findByName(obj.getItemName()).get(), ItemShoppingList::setItem));
        //propertyMapper2.addMappings(mapper -> mapper.map(obj -> this.shoppingListRepository.findById(obj.getShoppingListId()).get(), ItemShoppingList::setShoppingList));
        //propertyMapper2.addMappings(mapper -> mapper.map(obj -> Measurement.L, ItemShoppingList::setMeasurement));
    }



    public ShoppingListDto getShoppingListByUserEmail(String email) {
        try {
            int shoppingListId = shoppingListRepository.findDistinctByUserEmail(email).get().getShoppingListId();
            List<ItemShoppingListDto> items = getAllItemsFromShoppingList(shoppingListId);

            return new ShoppingListDto(shoppingListId, items);

        } catch(Exception e) {
            return null;
        }
    }
    public List<ItemShoppingListDto> getAllItemsFromShoppingList(int shoppingListId) {
        try {
            return shoppingListRepository
                    .findById(shoppingListId)
                    .get()
                    .getItemShoppingList()
                    .stream()
                    .map(obj -> mapper.map(obj, ItemShoppingListDto.class))
                    .toList();
        } catch(Exception e) {
            return null;
        }
        /*List<ItemShoppingList> items = itemShoppingListRepository.findAllByShoppingListShoppingListId(shoppingListRepository.findDistinctByUserEmail(email).get().getShoppingListId());
        List<ItemShoppingListDto> itemDtos = new ArrayList<>();

        items.forEach(obj -> itemDtos.add(mapper.map(obj, ItemShoppingListDto.class)));
        return itemDtos;*/
    }

    public boolean saveItemToShoppingList(ItemInShoppingListCreationDto itemInShoppingListCreationDto) {
        try {
            var itemShoppingList = ItemShoppingList.builder()
                            .item(itemRepository.findByName(itemInShoppingListCreationDto.getItemName()).get())
                            .amount(itemInShoppingListCreationDto.getAmount())
                            .measurement(itemInShoppingListCreationDto.getMeasurementType())
                            .shoppingList(shoppingListRepository.findById(itemInShoppingListCreationDto.getShoppingListId()).get())
                            .subUser(subUserRepository.findById(itemInShoppingListCreationDto.getSubUserId()).get())
                            .build();
            itemShoppingListRepository.save(itemShoppingList);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean deleteItemFromShoppingList(ItemInShoppingListCreationDto itemInShoppingListCreationDto) {
        try {
            ItemShoppingList item = itemShoppingListRepository
                    .findByItemNameAndShoppingList_ShoppingListId(itemInShoppingListCreationDto.getItemName(), itemInShoppingListCreationDto.getShoppingListId())
                    .get();
            itemShoppingListRepository.delete(item);
            return true;

            /*var itemRef = ItemShoppingList.builder()
                    .item(itemRepository.findByName(itemShoppingListDto.getItemName()).get())
                    .amount(itemShoppingListDto.getAmount())
                    .measurement(Measurement.L)
                    .shoppingList(shoppingListRepository.findById(itemShoppingListDto.getShoppingListId()).get())
                    .build();
            itemShoppingListRepository.delete(itemRef);
            return true;*/
        } catch (Exception e) {
            return false;
        }
    }

    public boolean shoppingListExists(int shoppingListId) {
        return shoppingListRepository.findById(shoppingListId).isPresent();
    }

    /**
     * Adds a weekly menu recipe list to the shopping list of the user
     *
     * @param dto the dto containing user and ingredient information
     * @return if the weekly menu recipe list was added
     */
    public boolean addWeeklyMenuToShoppingList(WeeklyMenuShoppingListDto dto) {

        String list = translateRecipeListToCorrectFormat(dto.getIngredients());

        System.out.println(list); // TODO Remove debug printing


        String[] lines = list.split("\n");
        for (String line : lines) {
            System.out.println(line); // TODO Remove debug printing
            String[] parts = line.split(";");
            String name = "";
            String category = "";
            String quantity = "";

            if (parts.length > 0) category = parts[0];
            if (parts.length > 1) name = parts[1];
            if (parts.length > 2) quantity = parts[2];

            String[] quantityAndMeasurement = quantity.split("(?<=\\d)(?=\\D)");

            quantity = quantityAndMeasurement[0];
            if (!quantity.matches("\\d+")) quantity = "1";
            Measurement measurement = Measurement.UNIT;

            if (quantityAndMeasurement.length > 1) {
                for(Measurement c : Measurement.values()) {
                    if (quantityAndMeasurement[1].equalsIgnoreCase(c.name())) measurement = c;
                }
            }

            if (!itemServices.checkIfItemExists(name)) {

                Optional<Category> categoryOptional = categoryRepository.findByDescription(category);
                int categoryId;

                categoryId = categoryOptional.map(Category::getCategoryId).orElse(1); // TODO Change 1 to "Other" category

                ItemDto itemDto = ItemDto.builder()
                        .categoryId(categoryId)
                        .name(name)
                        .build();

                itemServices.saveItem(itemDto);
            }


            ItemInShoppingListCreationDto itemInShoppingListCreationDto = ItemInShoppingListCreationDto
                    .builder()
                    .itemName(name)
                    .shoppingListId(dto.getShoppingListId())
                    .subUserId(dto.getSubUserId())
                    .amount(Integer.parseInt(quantity))
                    .measurementType(measurement)
                    .build();

            if (saveItemToShoppingList(itemInShoppingListCreationDto)) {
                System.out.println("Item added to shopping list");
            } else {
                System.out.println("Failed to add item to shopping list");
                return false;
            }

        }
        return true;
    }

    /**
     * Translates a recipe list to the correct format:
     * "Category, Item, Amount"
     *
     * @return the translated recipe list
     */
    private String translateRecipeListToCorrectFormat(List<String> recipeList) {

        List<Category> categories = categoryRepository.findAll();



        String query = "Write this shopping list with csv format, using semicolons " +
                "with the attributes category,ingredient,quantity." +
                " If no quantity is specified, use '1'." +
                " Use the categories ";


        for (Category category : categories) {
            query += category.getDescription() + ", ";
        }


        query += " and 'other'. Example: 'Meat;Beef;500g'. Here is the list: ";

        query += recipeList.toString();

        return aiServices.getChatCompletion(query);

    }

    /**
     * Checks if item exists in shopping list
     *
     * @param shoppingListId the shopping list ID
     * @param itemName the item name
     * @return if the item exists
     */
    public boolean itemExistsInShoppingList(int shoppingListId, String itemName) {
        return itemShoppingListRepository.findByItemNameAndShoppingList_ShoppingListId(itemName, shoppingListId).isPresent();
    }

    /**
     * Gets user email by shopping list ID
     *
     * @param shoppingListId shopping list ID
     * @return the user email
     */
    public String getUserEmail(int shoppingListId) {
        return shoppingListRepository.findById(shoppingListId).get().getUser().getEmail();
    }
}
