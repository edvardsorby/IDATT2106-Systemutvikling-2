package idatt2106v231.backend.repository;

import idatt2106v231.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,String> {

    Optional<User> findDistinctByEmail(String email);
}
