package idatt2106v231.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;

import java.time.YearMonth;

@Data
@ToString
@Builder
@Entity
@Table
@AllArgsConstructor
@DynamicUpdate
public class Garbage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int garbageId;

    @Column
    private YearMonth date;

    @Column
    private double amount;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "refrigerator_id", referencedColumnName = "refrigeratorId")
    private Refrigerator refrigerator;

    public Garbage(){
        this.date = YearMonth.now();
    }

    public void updateAmount(double amount){
        this.amount += amount;
    }
}