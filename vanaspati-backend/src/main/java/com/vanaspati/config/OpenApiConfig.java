package com.vanaspati.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI vanaspatiOpenApi() {
        return new OpenAPI()
            .info(new Info()
                .title("Vanaspati API")
                .description("India's Virtual Herbal Garden API")
                .version("v1")
                .contact(new Contact().name("Vanaspati Team").email("support@vanaspati.local"))
                .license(new License().name("MIT").url("https://opensource.org/licenses/MIT"))
            );
    }
}
