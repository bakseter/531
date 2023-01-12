package net.bakseter.api.plugins

import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.UserIdPrincipal
import io.ktor.server.auth.basic

fun Application.configureAuthentication(adminKey: String) {
    install(Authentication) {
        basic("auth-admin") {
            realm = "Access to everything."
            validate {
                if (it.name == "admin" && it.password == adminKey)
                    UserIdPrincipal(it.name)
                else
                    null
            }
        }
    }
}
