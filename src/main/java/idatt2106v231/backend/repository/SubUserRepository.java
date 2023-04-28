package idatt2106v231.backend.repository;

import idatt2106v231.backend.model.SubUser;
import idatt2106v231.backend.model.User;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubUserRepository extends JpaRepository<SubUser, Integer> {

    Optional<SubUser> findDistinctByName(String name);

    List<SubUser> findAllByUserEmail(String email);

    Optional<SubUser> findByUserEmailAndName(String email, String name);

    boolean existsBySubUserId(int subUserId);
}
