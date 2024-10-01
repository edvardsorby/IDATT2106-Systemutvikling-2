package idatt2106v231.backend.dto.refrigerator;

import idatt2106v231.backend.enums.Measurement;

import lombok.*;

import java.util.Date;

@Data
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EditItemInRefrigeratorDto {

    private int itemExpirationDateId;
    private double amount;
    private Measurement measurementType;
    private Date date;
}