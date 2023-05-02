package idatt2106v231.backend.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@Entity
@Table
@AllArgsConstructor
@NoArgsConstructor
public class SubUser {

    @Id
    @Column
    @NotNull
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int subUserId;

    @Column
    @Builder.Default
    private boolean accessLevel = false;

    @Column
    private int pinCode;

    @Column
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "masterUserId", referencedColumnName = "email")
    private User user;

    @OneToMany(mappedBy = "subUser", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemShoppingList> itemShoppingList = new ArrayList<>();

}
