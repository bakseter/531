package net.bakseter.api.schema

import kotlinx.serialization.Serializable
import net.bakseter.api.schema.Workout.check
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.Table

@Serializable
data class BaseWeightsModifierJson(
    val cycle: Int,
    val dl: Float,
    val bp: Float,
    val sq: Float,
    val op: Float,
)

object BaseWeightsModifier : Table("base_weights_modifier") {
    val email: Column<String> = text("email")
    val profile: Column<Int> = integer("profile").check("valid_profile") { it inList validProfile }
    val cycle: Column<Int> = integer("cycle")
    val dl: Column<Float> = float("dl")
    val bp: Column<Float> = float("bp")
    val sq: Column<Float> = float("sq")
    val op: Column<Float> = float("op")

    override val primaryKey: PrimaryKey = PrimaryKey(email, profile, cycle)
}
