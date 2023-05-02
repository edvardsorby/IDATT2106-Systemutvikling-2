package idatt2106v231.backend.controller;

import idatt2106v231.backend.dto.refrigerator.EditItemInRefrigeratorDto;
import idatt2106v231.backend.dto.refrigerator.ItemInRefrigeratorDto;
import idatt2106v231.backend.dto.refrigerator.RefrigeratorDto;
import idatt2106v231.backend.service.ItemServices;
import idatt2106v231.backend.service.RefrigeratorServices;
import idatt2106v231.backend.service.UserServices;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:8000/")
@RequestMapping("/api/refrigerators")
@Tag(name = "Refrigerator API", description = "API for managing refrigerators")
public class RefrigeratorController {

    private final Logger logger = LoggerFactory.getLogger(RefrigeratorController.class);

    private RefrigeratorServices refrigeratorServices;
    private UserServices userServices;
    private ItemServices itemServices;

    @Autowired
    public void setRefrigeratorServices(RefrigeratorServices refrigeratorServices) {
        this.refrigeratorServices = refrigeratorServices;
    }

    @Autowired
    public void setUserServices(UserServices userServices) {
        this.userServices = userServices;
    }

    @Autowired
    public void setItemServices(ItemServices itemServices) {
        this.itemServices = itemServices;
    }

    @GetMapping("/getRefrigeratorByUser")
    @Operation(summary = "Get refrigerator by user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Return the refrigerator"),
            @ApiResponse(responseCode = "404", description = "Refrigerator not found"),
            @ApiResponse(responseCode = "500", description = "Failed to retrieve refrigerator")
    })
    public ResponseEntity<Object> getRefrigeratorByUser(@RequestParam String userEmail) {
        ResponseEntity<Object> response;

        if (!userServices.checkIfUserExists(userEmail)){
            response = new ResponseEntity<>("Refrigerator does not exist", HttpStatus.NOT_FOUND);
            logger.info((String)response.getBody());
            return response;
        }

        RefrigeratorDto refrigerator = refrigeratorServices.getRefrigeratorByUserEmail(userEmail);
        if (refrigerator == null){
            response = new ResponseEntity<>("Failed to retrieve refrigerator", HttpStatus.BAD_REQUEST);
            logger.info((String)response.getBody());
        }
        else {
            response = new ResponseEntity<>(refrigerator, HttpStatus.OK);
            logger.info("Refrigerator retrieved");
        }
        return response;
    }

    @GetMapping("/getItemInRefrigeratorByCategory/{refrigeratorId}")
    @Operation(summary = "Get items refrigerator by refrigerator and category")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Return the items in the refrigerator"),
            @ApiResponse(responseCode = "404", description = "Refrigerator not found"),
            @ApiResponse(responseCode = "500", description = "Failed to retrieve refrigerator")
    })
    public ResponseEntity<Object> getItemsInRefrigeratorByCategory(@PathVariable("refrigeratorId") int refrigeratorId, @RequestParam int categoryId) {
        ResponseEntity<Object> response;

        if (!refrigeratorServices.refrigeratorExists(refrigeratorId)){
            response = new ResponseEntity<>("Refrigerator does not exists", HttpStatus.NOT_FOUND);
            logger.info((String)response.getBody());
            return response;
        }

        List<ItemInRefrigeratorDto> items = refrigeratorServices.getItemsInRefrigeratorByCategory(refrigeratorId, categoryId);

        if (items == null){
            response = new ResponseEntity<>("Failed to retrieve items in refrigerator", HttpStatus.INTERNAL_SERVER_ERROR);
            logger.info((String)response.getBody());
        }
        else {
            response = new ResponseEntity<>(items, HttpStatus.OK);
            logger.info("Refrigerator retrieved");
        }
        return response;
    }

    @PostMapping("/addItemInRefrigerator")
    @Operation(summary = "Add item in refrigerator")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Item is added to refrigerator"),
            @ApiResponse(responseCode = "400", description = "Data is not valid"),
            @ApiResponse(responseCode = "404", description = "Refrigerator or/and item does not exist"),
            @ApiResponse(responseCode = "500", description = "Item is not added to refrigerator")
    })
    public ResponseEntity<Object> addItemInRefrigerator(@RequestBody EditItemInRefrigeratorDto dto){
        ResponseEntity<Object> response = validateItemInRefrigerator(dto);

        if (response.getStatusCode() != HttpStatus.OK){
            return response;
        }

        if (refrigeratorServices.refrigeratorContainsItem(dto.getItemName(), dto.getRefrigeratorId()) &&
                refrigeratorServices.validMeasurementType(dto.getItemName(), dto.getRefrigeratorId(),dto.getMeasurementType()) &&
                refrigeratorServices.updateItemInRefrigeratorAmount(dto)) {
            response = new ResponseEntity<>("Item is updated", HttpStatus.OK);
        }
        else if(refrigeratorServices.addItemToRefrigerator(dto)){
            response = new ResponseEntity<>("Item is added to refrigerator", HttpStatus.CREATED);
        }
        else {
            response = new ResponseEntity<>("Item is not added to refrigerator", HttpStatus.INTERNAL_SERVER_ERROR);
           }
        logger.info((String) response.getBody());
        return response;
    }

    @DeleteMapping("/removeItem")
    @Operation(summary = "Remove item from refrigerator")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Removed item from refrigerator"),
            @ApiResponse(responseCode = "400", description = "Data is not valid"),
            @ApiResponse(responseCode = "404", description = "Refrigerator or/and item does not exist"),
            @ApiResponse(responseCode = "500", description = "Item is not removed from refrigerator")
    })
    public ResponseEntity<Object> removeItemFromRefrigerator(@RequestBody EditItemInRefrigeratorDto dto, @RequestParam boolean isGarbage) {
        ResponseEntity<Object> response = validateItemInRefrigerator(dto);

        if (response.getStatusCode() != HttpStatus.OK){
            return response;
        }
        if (!refrigeratorServices.refrigeratorContainsItem(dto.getItemName(), dto.getRefrigeratorId()) ) {
            response = new ResponseEntity<>("Item does not exist in refrigerator", HttpStatus.NOT_FOUND);
        }
        else if(!isGarbage && refrigeratorServices.deleteItemFromRefrigerator(dto)){
            response = new ResponseEntity<>("Item is removed from refrigerator", HttpStatus.OK);
        }
        else if(isGarbage && refrigeratorServices.addToGarbage(dto) && refrigeratorServices.deleteItemFromRefrigerator(dto)){
            response = new ResponseEntity<>("Item is removed from refrigerator and thrown in garbage", HttpStatus.OK);
        }
        else{
            response = new ResponseEntity<>("Item is not removed from refrigerator", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        logger.info((String) response.getBody());
        return response;
    }

    private ResponseEntity<Object> validateItemInRefrigerator(EditItemInRefrigeratorDto dto){
        ResponseEntity<Object> response;
        if (dto.getRefrigeratorId() == -1 || dto.getItemName().isEmpty() || dto.getAmount() == 0 || dto.getMeasurementType()==null){
            response = new ResponseEntity<>("Data is not valid", HttpStatus.BAD_REQUEST);
        }
        else if(!refrigeratorServices.refrigeratorExists(dto.getRefrigeratorId())){
            response = new ResponseEntity<>("Refrigerator does not exist", HttpStatus.NOT_FOUND);
        }
        else if(!itemServices.checkIfItemExists(dto.getItemName())){
            response = new ResponseEntity<>("Item does not exist", HttpStatus.NOT_FOUND);
        }
        else {
            response = new ResponseEntity<>(HttpStatus.OK);
        }
        return response;
    }
}